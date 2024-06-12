const Header = ({ course }) => <h1>{course}</h1>;

const Total = ({ sum }) => (
  <p>
    <strong>total of {sum} exercises</strong>
  </p>
);

const Part = ({ part, exercises }) => (
  <p>
    {part} {exercises}
  </p>
);
const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part.name} exercises={part.exercises} />
    ))}
  </>
);

const Course = ({ course }) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total
      sum={course.parts.reduce(
        (accumulator, currentValue) => accumulator + currentValue.exercises,
        0
      )}
    />
  </div>
);

export default Course;
