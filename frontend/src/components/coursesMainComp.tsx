import React from 'react';
import { useFetchInstructorCourses, useFetchAllCourses } from "../app/api/services/useFetchForumsAN";
import CourseCss from "../styles/coursesmainpage.module.css";
import { useRouter } from "next/navigation";
import { useState } from 'react';

export interface CourseData {
    _id: string;
    title: string;
    description: string;
    category: string[];
    modules: string[];
    students: string[];
    rating: number;
    isArchived: boolean;
    instructor_ids: string[];
    difficulty_level: string;
}

export interface TokenDetails {
    _id: string;
    name: string;
    profile_picture_url: string;
    role: string;
}

function Admincourses() {
    const { allcoursessData } = useFetchAllCourses();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = allcoursessData?.filter((course: CourseData) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            course.title.toLowerCase().includes(searchLower) ||
            course.description.toLowerCase().includes(searchLower) ||
            course._id.toLowerCase().includes(searchLower) ||
            course.category.some(cat => cat.toLowerCase().includes(searchLower))
        );
    });

    const handleCardClick = (courseId: string) => {
        router.push(`/course/${courseId}`);
    };

    return (
        <div className={CourseCss.container}>
            <div className={CourseCss.searchWrapper}>
                <input
                    type="text"
                    placeholder="Search courses by name, category, ID or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={CourseCss.searchInput}
                />
            </div>
            <div className={CourseCss.courseGrid}>
                {Array.isArray(filteredCourses) && filteredCourses.map((course: CourseData) => (
                    <div key={course._id} className={CourseCss.courseCard} onClick={() => handleCardClick(course._id)}>
                        <h3 className={CourseCss.courseTitle}>{course.title}</h3>
                        <div className={CourseCss.courseDetails}>
                            <p className={CourseCss.instructor}><span>Instructor:</span> {course.instructor_ids.join(', ')}</p>
                            <p className={CourseCss.description}><span>Description:</span> {course.description}</p>
                            <div className={CourseCss.categoryWrapper}>
                                <span>Categories:</span>
                                <div className={CourseCss.categories}>
                                    {course.category.map((cat, index) => (
                                        <p key={index} className={CourseCss.category}>{cat}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Update Student and Instructor components similarly
function Studentcourses({ tokenDetails }: { tokenDetails: TokenDetails }) {
    const { allcoursessData } = useFetchAllCourses();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = allcoursessData?.filter((course: CourseData) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            course.title.toLowerCase().includes(searchLower) ||
            course.description.toLowerCase().includes(searchLower) ||
            course._id.toLowerCase().includes(searchLower) ||
            course.category.some(cat => cat.toLowerCase().includes(searchLower))
        );
    });

    const handleCardClick = (courseId: string) => {
        router.push(`/course/${courseId}`);
    };

    return (
        <div className={CourseCss.container}>
            <div className={CourseCss.searchWrapper}>
                <input
                    type="text"
                    placeholder="Search courses by name, category, ID or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={CourseCss.searchInput}
                />
            </div>
            <div className={CourseCss.courseGrid}>
                {Array.isArray(filteredCourses) && filteredCourses.map((course: CourseData) => (
                    <div key={course._id} className={CourseCss.courseCard} onClick={() => handleCardClick(course._id)}>
                        <h3 className={CourseCss.courseTitle}>{course.title}</h3>
                        <div className={CourseCss.courseDetails}>
                            <p className={CourseCss.instructor}><span>Instructor:</span> {course.instructor_ids.join(', ')}</p>
                            <p className={CourseCss.description}><span>Description:</span> {course.description}</p>
                            <div className={CourseCss.categoryWrapper}>
                                <span>Categories:</span>
                                <div className={CourseCss.categories}>
                                    {course.category.map((cat, index) => (
                                        <p key={index} className={CourseCss.category}>{cat}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Instructorcourses({ tokenDetails }: { tokenDetails: TokenDetails }) {

    const { superCourses } = useFetchInstructorCourses(tokenDetails._id);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: [''],
        difficulty_level: 'Beginner'
    });

    const filteredCourses = superCourses?.filter((course: CourseData) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            course.title.toLowerCase().includes(searchLower) ||
            course.description.toLowerCase().includes(searchLower) ||
            course._id.toLowerCase().includes(searchLower) ||
            course.category.some(cat => cat.toLowerCase().includes(searchLower))
        );
    });

    const handleCardClick = (courseId: string) => {
        router.push(`/course/${courseId}`);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/courses', {
                ...formData,
                instructor_ids: [tokenDetails._id],
                modules: [],
                students: [],
                rating: 0,
                isArchived: false
            });
            setShowModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    const handleCategoryChange = (index: number, value: string) => {
        const newCategories = [...formData.category];
        newCategories[index] = value;
        setFormData({ ...formData, category: newCategories });
    };

    const addCategory = () => {
        setFormData({ ...formData, category: [...formData.category, ''] });
    };

    return (
        <div className={CourseCss.container}>
            <div className={CourseCss.headerSection}>
                <div className={CourseCss.searchWrapper}>
                    <input type="text" placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={CourseCss.searchInput}/>
                    <button onClick={() => setShowModal(true)} className={CourseCss.createbutton}>Create</button>
                </div>
            </div>
            {showModal && (
                <div className={CourseCss.modalOverlay}>
                    <div className={CourseCss.modalContent}>
                        <h2>New Course</h2>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label className={CourseCss.modalLabel}>Title</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={CourseCss.modalInput} required/>
                            </div>
                            <div>
                                <label className={CourseCss.modalLabel}>Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={CourseCss.modalInput} required/>
                            </div>
                            <div>
                                <label className={CourseCss.modalLabel}>Categories</label>
                                {formData.category.map((cat, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input type="text" value={cat} onChange={(e) => handleCategoryChange(index, e.target.value)} className={CourseCss.modalInput} required/>
                                    </div>
                                ))}
                                <button type="button" onClick={addCategory} className={CourseCss.addCategoryButton}>+ Add Category</button>
                            </div>
                            <div>
                                <label className="1">Difficulty Level</label>
                                <select value={formData.difficulty_level} onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}className={CourseCss.select1} >
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className={CourseCss.createbutton2}>Cancel</button>
                                <button type="submit" className={CourseCss.createbutton2}>Create Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className={CourseCss.courseGrid}>
                {Array.isArray(filteredCourses) && filteredCourses.map((course: CourseData) => (
                    <div key={course._id} className={CourseCss.courseCard} onClick={() => handleCardClick(course._id)}>
                        <h3 className={CourseCss.courseTitle}>{course.title}</h3>
                        <div className={CourseCss.courseDetails}>
                            <p className={CourseCss.instructor}><span>Instructor:</span> {course.instructor_ids.join(', ')}</p>
                            <p className={CourseCss.description}><span>Description:</span> {course.description}</p>
                            <div className={CourseCss.categoryWrapper}>
                                <span>Categories:</span>
                                <div className={CourseCss.categories}>
                                    {course.category.map((cat, index) => (
                                        <p key={index} className={CourseCss.category}>{cat}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { Admincourses, Studentcourses, Instructorcourses };