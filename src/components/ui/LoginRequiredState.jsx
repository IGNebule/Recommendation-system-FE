import { Link } from "react-router-dom"

const LoginRequiredState = ({
    message = "You must login"
}) => {
    return (
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-violet-100">{message}</p>

          <Link
            to="/login"
            className="inline-flex w-fit items-center justify-center rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            Login
          </Link>
        </div>
      </div>
    );
}

export default LoginRequiredState