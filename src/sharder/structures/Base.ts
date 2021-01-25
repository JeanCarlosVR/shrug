import IPC from "./IPC";
class Base {

    protected bot;
    protected clusterID;
    protected ipc;

    public constructor(setup) {
        this.bot = setup.bot;
        this.clusterID = setup.clusterID;
        this.ipc = new IPC();
    }

    public restartCluster(clusterID) {
        this.ipc.sendTo(clusterID, "restart", { name: "restart" });
    }
}

export = Base;