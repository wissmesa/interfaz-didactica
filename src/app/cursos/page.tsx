import Link from "next/link";
import { categories, courses } from "@/data/site";
import { CourseCard } from "@/components/CourseCard";
import { Suspense } from "react";

function CoursesGrid({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const category = typeof searchParams.categoria === "string" ? searchParams.categoria : undefined;
  const list = category ? courses.filter((c) => c.categorySlug === category) : courses;
  const selectedCategory = categories.find((c) => c.slug === category);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-semibold">Cursos {selectedCategory ? `· ${selectedCategory.name}` : ""}</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/cursos" className={!selectedCategory ? "px-3 py-1 rounded-full bg-indigo-600 text-white text-sm" : "px-3 py-1 rounded-full bg-white border text-sm"}>Todos</Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/cursos?categoria=${cat.slug}`}
            className={selectedCategory?.slug === cat.slug ? "px-3 py-1 rounded-full bg-indigo-600 text-white text-sm" : "px-3 py-1 rounded-full bg-white border text-sm"}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </div>
  );
}

export default function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return (
    <Suspense>
      <CoursesGrid searchParams={searchParams} />
    </Suspense>
  );
}


