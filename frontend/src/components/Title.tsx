export default function Title({ title }: { title: string }) {
    return (
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white flex flex-row">
            <span className="py-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
                {title}
            </span>
        </h1>
    );
}