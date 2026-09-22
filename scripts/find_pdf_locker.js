const fs = require('fs');
const { execSync } = require('child_process');

const psScript = `
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public class FileLockFinder {
    [DllImport("rstrtmgr.dll", CharSet = CharSet.Auto)]
    static extern int RmStartSession(out uint pSessionHandle, int dwSessionFlags, string strSessionKey);

    [DllImport("rstrtmgr.dll")]
    static extern int RmEndSession(uint pSessionHandle);

    [DllImport("rstrtmgr.dll", CharSet = CharSet.Auto)]
    static extern int RmRegisterResources(uint pSessionHandle, uint nFiles, string[] rgsFilenames, uint nApplications, object[] rgApplications, uint nServices, object[] rgsServiceNames);

    [DllImport("rstrtmgr.dll")]
    static extern int RmGetList(uint pSessionHandle, out uint pnProcInfoNeeded, ref uint pnProcInfo, [In, Out] RM_PROCESS_INFO[] rgAffectedApps, ref uint lpdwRebootReasons);

    [StructLayout(LayoutKind.Sequential)]
    struct RM_UNIQUE_PROCESS {
        public int dwProcessId;
        public System.Runtime.InteropServices.ComTypes.FILETIME ProcessStartTime;
    }

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)]
    struct RM_PROCESS_INFO {
        public RM_UNIQUE_PROCESS Process;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 256)]
        public string strAppName;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 64)]
        public string strServiceShortName;
        public int ApplicationType;
        public uint AppStatus;
        public uint TSSessionId;
        [MarshalAs(UnmanagedType.Bool)]
        public bool bRestartable;
    }

    public static void FindLockers(string path) {
        uint handle;
        string key = Guid.NewGuid().ToString();
        int res = RmStartSession(out handle, 0, key);
        if (res != 0) return;
        try {
            string[] resources = new string[] { path };
            res = RmRegisterResources(handle, (uint)resources.Length, resources, 0, null, 0, null);
            if (res != 0) return;
            uint pnProcInfoNeeded = 0;
            uint pnProcInfo = 0;
            uint lpdwRebootReasons = 0;
            res = RmGetList(handle, out pnProcInfoNeeded, ref pnProcInfo, null, ref lpdwRebootReasons);
            if (res == 234) {
                RM_PROCESS_INFO[] infos = new RM_PROCESS_INFO[pnProcInfoNeeded];
                pnProcInfo = pnProcInfoNeeded;
                res = RmGetList(handle, out pnProcInfoNeeded, ref pnProcInfo, infos, ref lpdwRebootReasons);
                if (res == 0) {
                    for (int i = 0; i < pnProcInfo; i++) {
                        Console.WriteLine("LOCK_FOUND: PID=" + infos[i].Process.dwProcessId + " APP=" + infos[i].strAppName);
                    }
                }
            } else {
                Console.WriteLine("NO_LOCK_DETECTED (code " + res + ")");
            }
        } finally {
            RmEndSession(handle);
        }
    }
}
"@
[FileLockFinder]::FindLockers('C:\\Users\\BIT\\Desktop\\Zoho-assignment\\assignment_report.pdf')
`;

fs.writeFileSync('temp_find_lock.ps1', psScript, 'utf8');
try {
  const res = execSync('powershell -ExecutionPolicy Bypass -File temp_find_lock.ps1').toString();
  console.log('Result:\n', res);
} catch (e) {
  console.log('Error:', e.message);
} finally {
  if (fs.existsSync('temp_find_lock.ps1')) fs.unlinkSync('temp_find_lock.ps1');
}
