import ContentForm from '@/components/Exams/ContentForm';

export function EditableComment({ userImg, onCancel, onSubmit }: {
    userImg?: string | null,
    onCancel: () => void,
    onSubmit: (newText: string | null, newPng: File | null) => void
}) {
    return (
        <>
            <div className="flex items-start space-x-4">
                {!!userImg && (
                    <div className="flex-shrink-0 flex flex-col gap-1">
                    <img
                        className="inline-block h-10 w-10 rounded-full mb-2"
                        src={userImg}
                        alt="user profile"
                    />
                </div>
                )}
                <div className="min-w-0 flex-1">
                    <ContentForm
                        initialText={null}
                        initialPNG={null}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                </div>
            </div>
        </>
    );
}

export default EditableComment;