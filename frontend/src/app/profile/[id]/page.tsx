export default function CoursePage({ params } : { params:{id:string} }) {
    const {id} = params;
    return <h1>Course Page no. {id || 'i wanna die'}</h1>;
}