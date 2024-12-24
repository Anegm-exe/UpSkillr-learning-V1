import styles from '@/styles/aboutcss.module.css'; // Import CSS module for styling

export default function About() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>About Upskillr</h1>
            <p className={styles.description}>
                Welcome to Upskillr, your go-to platform for enhancing your skills and knowledge in various fields. 
                Our mission is to empower learners of all ages to achieve their personal and professional goals through high-quality online education.
            </p>
            <h2 className={styles.subtitle}>Our Mission</h2>
            <p className={styles.description}>
                At Upskillr, we believe that learning should be accessible, engaging, and tailored to individual needs. 
                Our mission is to provide a diverse range of courses that cater to different learning styles and preferences, 
                helping you to upskill and stay competitive in today’s fast-paced world.
            </p>
            <h2 className={styles.subtitle}>What We Offer</h2>
            <ul className={styles.featuresList}>
                <li className={styles.featureItem}>✔️ A wide variety of courses across multiple disciplines</li>
                <li className={styles.featureItem}>✔️ Interactive learning materials and resources</li>
                <li className={styles.featureItem}>✔️ Expert instructors with real-world experience</li>
                <li className={styles.featureItem}>✔️ Flexible learning schedules to fit your lifestyle</li>
                <li className={styles.featureItem}>✔️ Community support and networking opportunities</li>
            </ul>
            <h2 className={styles.subtitle}>Join Us Today!</h2>
            <p className={styles.description}>
                Whether you’re looking to advance your career, switch fields, or simply learn something new, 
                Upskillr is here to support you on your learning journey. 
                Sign up today and start exploring our courses!
            </p>
        </div>
    );
}