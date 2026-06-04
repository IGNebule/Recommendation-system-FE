const LoadingState = ({ message = "Loading..." }) => {
    return (
        <div className="py-8 text-center text-white/50">
            {message}
        </div>
    )
}

export default LoadingState