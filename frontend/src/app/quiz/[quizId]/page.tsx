export default async function QuizPage({ params } : { params:{quizId:string}}) {
    const {quizId} = await params;
    return <h1>Quiz Page no. {quizId}</h1>;
}