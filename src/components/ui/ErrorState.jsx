const ErrorState = ({ message = "Something went wrong" }) => {
    return (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {message}
        </div>
    )
}

export default ErrorState