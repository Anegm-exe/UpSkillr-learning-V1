export default function QuizPage({ params } : { params:{quizId:string}}) {
    //@ts-ignore
    const {quizId} = React.use(params);
    return <h1>Quiz Page no. {quizId}</h1>;
}