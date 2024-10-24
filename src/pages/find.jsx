import Div from "../comps/div";
import H1 from "../comps/h1";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import "./find.css";

export default function FinderPage() {
    const navigate = useNavigate();

    function handleRedirect(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const query = formData.get("query");
        if (query) {
            navigate(`/find/${query}`);
        }
    }

    return (
        <Fragment id="frag">
            <Div id="main" width="700" height="900">
                <H1 id="header">Roblox User LookUp</H1>
                <Div id="inner_div" width="600" height="200">
                    <label id="user">UserID:</label>
                    <br />
                    <br />
                    <form onSubmit={handleRedirect}>
                        <input 
                            id="req" 
                            type="username" 
                            required 
                            placeholder="UserID" 
                            name="query"
                            defaultValue={1648277089}
                            min={1}
                        />
                        <button type="submit" id="btn">
                            <i className="bi bi-search"></i>
                        </button>
                    </form>
                    <br></br>
                    <br />
                </Div>
            </Div>
        </Fragment>
    );
}
