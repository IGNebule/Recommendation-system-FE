const EmptyState = ({ message = "No data found" }) => {
    return (
        <div className="py-8 text-center text-white/40">
            {message}
        </div>
    )
}

export default EmptyState