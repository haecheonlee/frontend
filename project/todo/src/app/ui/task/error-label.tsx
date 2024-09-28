export default function ErrorLabel({ message }: Readonly<{ message: string }>) {
    return <p className="my-2 text-sm text-red-500">{message}</p>;
}
