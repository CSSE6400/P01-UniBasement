import { useForm } from 'react-hook-form';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Button } from '@/components/Button';
import { AddExamFormFields } from '@/types';

const examTypeOptions = [
    { label: 'Final', value: 'final' },
    { label: 'Midsem', value: 'midsem' },
    { label: 'Quiz', value: 'quiz' },
];
const examSemesterOptions = [
    { label: 'Semester 1', value: 1 },
    { label: 'Semester 2', value: 2 },
    { label: 'Summer Semester', value: 3 },
];

export default function AddExamForm({ onSubmit }: { onSubmit: (data: AddExamFormFields) => void }) {
    const { register, handleSubmit } = useForm<AddExamFormFields>();

    return (
        <form
            className="w-full"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Input label="Year" {...register('examYear')} />
            <Select
                label="Semester"
                options={examSemesterOptions} {...register('examSemester')}
            />
            <Select
                label="Type"
                options={examTypeOptions} {...register('examType')}
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

