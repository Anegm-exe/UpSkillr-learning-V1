export default async function CoursePage({ params } : { params:{solutionid:string} }) {
    const solutionid = params.solutionid;
    return <h1>Course Page no. {solutionid || 'i wanna die'}</h1>;
}