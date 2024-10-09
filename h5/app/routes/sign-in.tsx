import { Link } from "@remix-run/react";

export default function SignIn() {
  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">登录账号</h2>
        </div>
        <form className="mt-8 space-y-6" autoComplete="on">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">邮箱地址</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input rounded-t-md"
                placeholder="邮箱"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">密码</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                maxLength="16"
                required
                className="form-input rounded-b-md"
                placeholder="密码"
              />
            </div>
          </div>
  
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                记住我
              </label>
            </div>
            <div className="text-sm">
              <a
                href="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                忘记密码?
              </a>
            </div>
          </div>
  
          <div>
            <button type="submit" className="form-btn">
              登录
            </button>
          </div>
          <div>
            <Link to="/sign-up" className="no-underline">
              <button className="form-btn"> 注册 </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
