import { useEffect, useState } from "react";

export default function Library() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch or load local storage of lecture list
    // Progress until success:
    // 1. if local storage newer than 24 hours - use local storage
    // 2. fetch lecture list from API - use fetched, save data to local storage
    // 3. use local storage, even if old - use local storage
    // 4. throw Error

    const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

    function getCachedLectures () {
      return JSON.parse(localStorage.getItem("lectures")) || [];
    };

    function checkCachedLectureDate () {
      const cacheTimestamp = localStorage.getItem("lectures_timestamp");
      return (
        cacheTimestamp &&
        Date.now() - parseInt(cacheTimestamp, 10) < CACHE_EXPIRY_TIME
      );
    }

    const fetchLectures = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/lectures");
        if (!response.ok) {
          throw new Error(`Failed to fetch lectures: ${response.status}`);
        }

        const data = await response.json();
        setLectures(data);
        localStorage.setItem("lectures", JSON.stringify(data));
        localStorage.setItem("lectures_timestamp", Date.now().toString());
      } catch(err) {
        console.error("Error fetching lectures:", err);

        const cachedLectures = getCachedLectures();
        if (cachedLectures.length > 0) {
          setLectures(cachedLectures);
        } else {
          setError("Failed to fetch lectures and no cached data available.");
        }
      } finally {
        setLoading(false);
      }
    }

    if (checkCachedLectureDate()) {
      setLectures(getCachedLectures());
      setLoading(false);
    } else {
      fetchLectures();
    }

  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <ul>
        {lectures.map((lecture) => (
          <li key={lecture.id}>
            {lecture.id} : {lecture.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
