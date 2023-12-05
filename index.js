// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];

 // Define a function named getLearnerData that takes CourseInfo, AssignmentGroup, and LearnerSubmissions as parameters
const getLearnerData = (CourseInfo, AssignmentGroup, LearnerSubmissions) => {
  try {
    // Check if the provided AssignmentGroup belongs to the provided Course
    if (AssignmentGroup.course_id !== CourseInfo.id) {
      throw new Error("This ag does not belong to the provided Course.");
    }

    //Map to store learner data using learner_id as the key
    const learnerMap = new Map();

    // Get the current date and time
    const currentDate = new Date();

      // Process LearnerSubmissions to extract and calculate data
      LearnerSubmissions.forEach(({ learner_id, assignment_id, submission }) => {
        // Find the assignment within the AssignmentGroup that matches the submission
        const assignment = AssignmentGroup.assignments.find(a => a.id === assignment_id);
        if (!assignment) return; // If the assignment is not found, skip processing
  
        // Get the due date of the assignment and check if it's past the current date
        const dueDate = new Date(assignment.due_at);
        if (dueDate > currentDate) return; // If the assignment isn't due yet, skip processing
  
        // Check if the learner already exists in the learnerMap; if he doesn't exist, initialize their data
        if (!learnerMap.has(learner_id)) {
          learnerMap.set(learner_id, { id: learner_id, totalScore: 0, totalPoints: 0, scores: {} });
        }
  
        // Get the learner's data from the learnerMap
        const learner = learnerMap.get(learner_id);
  
        // Calculate the penalty for late submissions
        const lateSubmission = new Date(submission.submitted_at) > dueDate;
        const latePenalty = lateSubmission ? assignment.points_possible * 0.1 : 0;
  
        // Update the learner's totalScore and totalPoints with the submission data
        learner.totalScore += submission.score - latePenalty;
        learner.totalPoints += assignment.points_possible;
  
        // Store the scores for each assignment for the learner
        learner.scores[assignment_id] = (submission.score - latePenalty) / assignment.points_possible;
      });
  
      // Calculate weighted average and return formatted results
      const results = []; // Create an empty array to store the formatted results
      for (const [, learner] of learnerMap) { // Loop through each learner in the learnerMap
        const avg = (learner.totalScore / learner.totalPoints) || 0; // Calculate the average score of the learner's submissions, default to 0 if dividing by zero
        const formattedResult = { // Create a formatted result object for the learner
          id: learner.id, // Assign the learner's ID to the 'id' property
          avg: parseFloat((avg * 100).toFixed(3)), // Calculate the average score, multiply by 100 to convert to percentage, round to three decimal places, and parse as float
          ...learner.scores, // Spread the learner's individual assignment scores into the formatted result object
        };
        results.push(formattedResult); // Push the formatted result object into the results array
      }
      
      return results; // Return the array containing all the formatted results
      } catch (error) {
        return error.message; // If there's an error, return the error message
      }
  }    
  
  // Usage example:
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  console.log(result);
  