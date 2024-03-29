import { observable, action} from "mobx";
import fetchHelper from "./fetchHelpers"
const URL = require("../../package.json").serverURL;


class StatsStore {
    @observable messageFromServer = "";
    @observable errorMessage = "";
    @observable stats = {
        success: true,
        games: []
    };
    

    @action
    setErrorMessage = (err) => {
        this.errorMessage = err;
    }

    @action
    getStats = () => {
        this.errorMessage = "";
        this.messageFromServer = "";
        let errorCode = 200;
        const options = fetchHelper.makeOptions("GET", true);
        fetch(URL + "api/stats", options)
            .then((res) => {
                if (res.status > 210 || !res.ok) {
                    errorCode = res.status;
                }
                return res.json();
            })
            .then(action((res) => {  //Note the action wrapper to allow for useStrict
                if (errorCode !== 200) {
                    throw new Error(`${res.error.message} (${res.error.code})`);
                }
                else {
                    this.messageFromServer = res.success;
                    this.stats = res;
                }
            })).catch(err => {
            //This is the only way (I have found) to verify server is not running
            this.setErrorMessage(fetchHelper.addJustErrorMessage(err));
        })
    }
}

let statsStore = new StatsStore();

//Only for debugging
//window.userStore = userStore;
export default statsStore;
