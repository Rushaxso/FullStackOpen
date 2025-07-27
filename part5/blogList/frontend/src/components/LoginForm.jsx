const LoginForm = ({username, onUsernameChange, password, onPasswordChange, handleLogin}) => {
  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            data-testid="username"
            type="text"
            value={username}
            name="Username"
            onChange={onUsernameChange}
          />
        </div>
        <div>
          password
          <input
            data-testid="password"
            type="password"
            value={password}
            name="Password"
            onChange={onPasswordChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm