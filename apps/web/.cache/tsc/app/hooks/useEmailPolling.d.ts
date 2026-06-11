interface UseEmailPollingOptions {
    enabled?: boolean;
    interval?: number;
    /** ISO timestamp of the newest email currently displayed */
    newestEmailAt?: string | null;
}
export declare function useEmailPolling({ enabled, interval, newestEmailAt, }?: UseEmailPollingOptions): {
    poll: () => Promise<void>;
};
export {};
