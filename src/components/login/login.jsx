export function Login(){
    return(
        <div>
            <h4 data-testid="title" >User Login</h4>
            <dl>
                <dt>Name</dt>
                <dd> <input type="text" /> </dd>
                <dt>Password</dt>
                <dd> <input type="password" /> </dd>
            </dl>
            <button>Login</button>
            <a href="forgot-password">Forgot Password</a>
        </div>
    )
}
