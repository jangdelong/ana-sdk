declare class ErrLock {
    private config;
    private globalContext;
    private dataHub;
    constructor(options: any);
    private _catchBrowserError;
}
export default ErrLock;
