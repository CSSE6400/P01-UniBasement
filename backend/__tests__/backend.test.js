const { single_nest, nest } = require("../src/routes/routes");

// All tests for the nest function
describe("nest function", () => {
  // Test when all comments are top-level (no parent)
  test("Should handle top-level comments", () => {
    const comments = [
      { commentId: 1, parentCommentId: null },
      { commentId: 2, parentCommentId: null },
    ];
    const nestedComments = nest(comments);
    expect(nestedComments).toEqual(comments);
  });

  // Test when all comments are nested under a single parent
  test("Should handle nested comments", () => {
    const comments = [
      { commentId: 1, parentCommentId: null },
      { commentId: 2, parentCommentId: 1 },
      { commentId: 3, parentCommentId: 1 },
    ];
    const nestedComments = nest(comments);
    expect(nestedComments).toEqual([
      {
        commentId: 1,
        parentCommentId: null,
        children: [
          { commentId: 2, parentCommentId: 1 },
          { commentId: 3, parentCommentId: 1 },
        ],
      },
    ]);
  });

  // Test when the comments array is empty
  test("Should handle empty array", () => {
    const comments = [];
    const nestedComments = nest(comments);
    expect(nestedComments).toEqual([]);
  });

  // Test when comments are nested at multiple levels
  test("Should handle multi-level nested comments", () => {
    const comments = [
      { commentId: 1, parentCommentId: null },
      { commentId: 2, parentCommentId: 1 },
      { commentId: 3, parentCommentId: 2 },
    ];
    const nestedComments = nest(comments);
    expect(nestedComments).toEqual([
      {
        commentId: 1,
        parentCommentId: null,
        children: [
          {
            commentId: 2,
            parentCommentId: 1,
            children: [{ commentId: 3, parentCommentId: 2 }],
          },
        ],
      },
    ]);
  });

  // Test when there are multiple top-level comments
  test("Should handle multiple top-level comments", () => {
    const comments = [
      { commentId: 1, parentCommentId: null },
      { commentId: 2, parentCommentId: null },
      { commentId: 3, parentCommentId: 1 },
    ];
    const nestedComments = nest(comments);
    expect(nestedComments).toEqual([
      {
        commentId: 1,
        parentCommentId: null,
        children: [{ commentId: 3, parentCommentId: 1 }],
      },
      { commentId: 2, parentCommentId: null },
    ]);
  });
});

// All tests for the single_nest function
describe("single_nest function", () => {
  // Test when the commentId does not exist in the comments
  test("Should handle non-existent commentId", () => {
    const comments = [
      { commentId: 1, parentCommentId: null },
      { commentId: 2, parentCommentId: 1 },
    ];
    const nestedComments = single_nest(comments, 3);
    expect(nestedComments).toEqual([]);
  });

  // Test when the commentId is a top-level comment
  test("Should handle top-level commentId", () => {
    const comments = [
      { commentId: 1, parentCommentId: null },
      { commentId: 2, parentCommentId: 1 },
    ];
    const nestedComments = single_nest(comments, 1);
    expect(nestedComments).toEqual([
      {
        commentId: 1,
        parentCommentId: null,
        children: [{ commentId: 2, parentCommentId: 1 }],
      },
    ]);
  });

  // Test when the commentId is a nested comment
  test("Should handle nested commentId", () => {
    const comments = [
      { commentId: 1, parentCommentId: null },
      { commentId: 2, parentCommentId: 1 },
    ];
    const nestedComments = single_nest(comments, 2);
    expect(nestedComments).toEqual([{ commentId: 2, parentCommentId: 1 }]);
  });

  // Test when the commentId has children
  test("Should handle commentId with children", () => {
    const comments = [
      { commentId: 1, parentCommentId: null },
      { commentId: 2, parentCommentId: 1 },
      { commentId: 3, parentCommentId: 2 },
    ];
    const nestedComments = single_nest(comments, 2);
    expect(nestedComments).toEqual([
      {
        commentId: 2,
        parentCommentId: 1,
        children: [{ commentId: 3, parentCommentId: 2 }],
      },
    ]);
  });

  // Test when the commentId is null
  test("Should handle null commentId", () => {
    const comments = [
      { commentId: 1, parentCommentId: null },
      { commentId: 2, parentCommentId: 1 },
    ];
    const nestedComments = single_nest(comments, null);
    expect(nestedComments).toEqual([]);
  });

  // Test when the comments array is empty
  test("Should handle empty array", () => {
    const comments = [];
    const nestedComments = single_nest(comments, 1);
    expect(nestedComments).toEqual([]);
  });
});
