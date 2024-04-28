const { alwaysTrue, alwaysFalse, single_nest, nest } = require('../routes/routes');

describe('nest function', () => {
  test('should correctly nest comments', () => {
    const comments = [
      { commentsid: 1, parentcommentid: null },
      { commentsid: 2, parentcommentid: 1 },
      { commentsid: 3, parentcommentid: 1 },
      { commentsid: 4, parentcommentid: 2 },
    ];
    const nestedComments = nest(comments);
    expect(nestedComments).toEqual([
      {
        commentsid: 1,
        parentcommentid: null,
        children: [
          { commentsid: 2, parentcommentid: 1, children: [{ commentsid: 4, parentcommentid: 2 }] },
          { commentsid: 3, parentcommentid: 1 },
        ],
      },
    ]);
  });
});


describe('single_nest function', () => {
  test('should correctly filter comments', () => {
    const comments = [
      { commentsid: 1, parentcommentid: null },
      { commentsid: 2, parentcommentid: 1 },
      { commentsid: 3, parentcommentid: 1 },
      { commentsid: 4, parentcommentid: 2 },
    ];
    const filteredComments = single_nest(comments, 1);
    expect(filteredComments).toEqual([
      { commentsid: 2, parentcommentid: 1, children: [{ commentsid: 4, parentcommentid: 2 }] },
      { commentsid: 3, parentcommentid: 1 },
      { commentsid: 4, parentcommentid: 2 },
    ]);
  });
});