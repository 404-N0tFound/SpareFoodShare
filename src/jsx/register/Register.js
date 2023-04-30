function Register(){
  return(
    <form action="/register" method="post">
      username:
      <input type="text" name="username"/>
      password:
      <input type="password" name="password"/>
      account:
      <input type="text" name="account"/>
      email:
      <input type="email" name="email"/>
      phone:
      <input type="text" name="phone"/>
      role:
      <input type="text" name="role"/>
      <input type="submit" value="submit"/>
    </form>
  );
}

export default Register;