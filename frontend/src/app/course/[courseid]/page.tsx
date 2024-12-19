export default function CoursePage({ params }: { params: { courseid: string }; }) {
    return <h1>Course Page no. {params.courseid}</h1>;
}