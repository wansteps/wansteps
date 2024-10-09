import { Link } from "@remix-run/react";

export default function SignUp() {
  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">注册账号</h2>
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">邮箱地址</label>
              <input
                type="email"
                autoComplete="email"
                required
                className='form-input rounded-t-md'
                placeholder="邮箱"
              />
            </div>
            <div>
              <label htmlFor="password1" className="sr-only">密码</label>
              <input
                id="password1"
                name="password1"
                type="password"
                autoComplete="current-password"
                maxLength="16"
                required
                className='form-input'
                placeholder="密码"
              />
            </div>
            <div>
              <label htmlFor="password2" className="sr-only">确认密码</label>
              <input
                id="password2"
                name="password2"
                type="password"
                autoComplete="current-password"
                maxLength="16"
                required
                className="form-input"
                placeholder="确认密码"
              />
            </div>
            <div>
              <label htmlFor="verificationCode" className="sr-only">验证码</label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                required
                maxLength="6"
                className="form-input rounded-b-md"
                placeholder="验证码"
              />
            </div>
          </div>
  
          <div>
            <button type="submit" className="form-btn"> 注册 </button>
          </div>
          <div>
            <Link to="/sign-in" className="no-underline">
              <button className="form-btn"> 已有账号？立即登录 </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
