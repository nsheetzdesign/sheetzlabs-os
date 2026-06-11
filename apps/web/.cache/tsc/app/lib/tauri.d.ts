export declare function isTauri(): boolean;
export declare function sendNotification(title: string, body: string): Promise<void>;
export declare function getAppVersion(): Promise<string | null>;
