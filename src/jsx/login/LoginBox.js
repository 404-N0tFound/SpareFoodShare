import { Component } from "react";
import "./LoginBox.css";
import "../components/Theme.css";

class LoginBox extends Component {

    handleSubmit = e => {
        e.preventDefault();
        console.log(e.target.email.value);

        if (!e.target.email.value){
            alert("Don't forget to enter your email")
        } else if (!e.target.password.value){
            alert("Don't forget to enter your password")
        } else if(
            e.target.email.value === "test_email@gmail.com" &&
            e.target.password.value === "qwe123"
            ){
            alert("Welcome to your Spare Food Share account!")
        }

        {/* add check with the database of email/password combos */ }
    }

    handleClick = e => {
        e.preventDefault();
        {/* change to link to the registration form */ }
        alert("Go to registration form")
    }

  render() {
    return (
      <div className="page-content">
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="somename@gmail.com" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" />
          </div>
          <button className="login">Sign In</button>
        </form>
        <button className="register" onClick={this.handleClick}>
          Register
        </button>
      </div>
    );
  }


}

export default LoginBox;

