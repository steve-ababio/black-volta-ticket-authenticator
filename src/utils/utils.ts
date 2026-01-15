import { ScanAuditLog } from "@/models/models";

export const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };
  
  export const getAccessToken = () =>
    localStorage.getItem('accessToken');
  
  export const getRefreshToken = () =>
    localStorage.getItem('refreshToken');
  
  export const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  export function formatTime(date: string | Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  }

  export function logScanAudit(entry: ScanAuditLog) {
    const logs = JSON.parse(localStorage.getItem("scan-audit") || "[]");
    logs.push(entry);
    localStorage.setItem("scan-audit", JSON.stringify(logs));
  }
  