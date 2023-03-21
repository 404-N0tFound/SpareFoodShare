import { Component } from "react";
import "./PersonalDetails.css";

class PersonalDetails extends Component {
    render() {
        return (
            <div className="Personal_Details">


                    <form action="src/jsx/PersonalDetailPage">
                        <h2>Personal Details </h2>
                        <ul>
                            <li>
                                <label>Name：</label>
                                <input type="text" className="inp" id="username" placeholder=""/>
                            </li>
                            <li>
                                <label>Phone&nbsp;&nbsp;number：</label>

                                <input type="text" className="inp" id="phone_number" placeholder="+44"/>

                            </li>
                            <li>
                                <label>Email：</label>

                                <input type="email" className="inp" id="email" placeholder=""/>

                            </li>
                            <li>
                                <label>Password：</label>

                                <input type="password" className="inp" id="password" placeholder=""/>

                            </li>
                            <li>
                                <label>Location：</label>

                                <input type="text" className="inp" id="location" placeholder=""/>

                            </li>


                            <li>
                                <label>My&nbsp;&nbsp;Introduction：</label>

                                <textarea className="inp" id="description"
                                          placeholder=" Introduce Yourself"> </textarea>

                            </li>

                        </ul>


                        <div>
                            <input className="button" type="submit" value=' Save Changes'></input>

                        </div>
                    </form>
                </div>


        );
    }
}
export default PersonalDetails;