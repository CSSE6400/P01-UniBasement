'use client';
import useExam from '@/api/useExam';
import useQuestions from '@/api/useQuestions';
import requireAuth from '@/app/requireAuth';
import Question from '@/components/Exams/Question';
import Title from '@/components/Title';
import usePostQuestion from '@/api/usePostQuestion';
import useUpdateQuestions from '@/api/useUpdateQuestions';
import { Question as IQuestion } from '@/types';
import Card from '@/components/Card';
import { useState } from 'react';
import ContentForm from '@/components/Exams/ContentForm';
import { useUser } from '@auth0/nextjs-auth0/client';
import { IconCirclePlus } from '@tabler/icons-react';

function sortQuestionsById(a: IQuestion, b: IQuestion) {
    if (a.questionId < b.questionId) {
        return -1;
    } else if (a.questionId > b.questionId) {
        return 1;
    } else {
        return 0;
    }
}

function Exam({ params }: { params: { courseCode: string; examId: number } }) {
    const { user } = useUser();
    const { exam, isLoading, isError } = useExam(params.examId);
    const {
        questions,
        isLoading: isLoadingQuestions,
        isError: isErrorQuestions,
    } = useQuestions(params.examId);

    const { postQuestion } = usePostQuestion(params.examId);
    const { updateQuestionContent } = useUpdateQuestions(params.examId);

    const [addingQuestion, setAddingQuestion] = useState(false);

    return (
        <main>
            <div className="max-w-4xl w-full mx-auto flex flex-col items-center justify-center">
                {isLoadingQuestions && (
                    <div role="status" className="absolute left-[50%] top-[50%]">
                        <svg aria-hidden="true"
                             className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-emerald-600"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                )}
                {!isLoading && !isError && (
                    <>
                        <Title title={`${params.courseCode} ${exam?.examType}`}/>
                        <div className="flex items-center justify-center pb-8 text-3xl">
                            {`${exam?.examYear} Semester ${exam?.examSemester}`}
                        </div>
                    </>
                )}
                <div className="grid grid-cols-1 gap-4 w-full">
                    {!isErrorQuestions && !isLoadingQuestions && questions?.sort(sortQuestionsById)?.map(question => (
                        <Question
                            key={question.questionId}
                            question={question}
                            updateQuestionContent={updateQuestionContent}
                        />
                    ))}

                    {addingQuestion ? (
                        <Card>
                            <ContentForm
                                initialText=""
                                initialPNG=""
                                onCancel={() => setAddingQuestion(false)}
                                onSubmit={async (newText, newPng) => {
                                    await postQuestion(user?.sub || '', newText, newPng);
                                    setAddingQuestion(false);
                                }}
                            />
                        </Card>
                    ) : (
                        <button onClick={() => setAddingQuestion(true)}>
                            <Card>
                                <p className="flex items-center justify-center gap-1 text-md text-gray-500 dark:text-gray-400 font-medium">Add Question <IconCirclePlus/></p>
                            </Card>
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}

export default requireAuth(Exam);
