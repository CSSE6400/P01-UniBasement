import { useForm } from 'react-hook-form';
import Input from '@/components/Input';
import Select from '@/components/Select';
import TextArea from '@/components/TextArea';
import { Button } from '@/components/Button';

const universityOptions = [
    { label: 'University of Queensland', value: 'UQ' },
];

type AddCourseFormFields = {
    courseCode: string
    courseName: string
    courseDescription: string
    university: string
}

export default function AddCourseForm({ onSubmit }: { onSubmit: (data: AddCourseFormFields) => void }) {
    const { register, handleSubmit } = useForm<AddCourseFormFields>();

    return (
        <form
            className="w-full"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Input label="Course Code" {...register('courseCode')} />
            <Input label="Course Name" {...register('courseName')} />
            <TextArea label="Course Description" {...register('courseDescription')} />
            <Select
                label="University"
                options={universityOptions} {...register('university')}
            />
            <Button
                type="submit"
                className="w-full"
            >
                Submit
            </Button>
        </form>
    );
}

