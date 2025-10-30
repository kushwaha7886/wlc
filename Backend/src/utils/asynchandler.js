

const asyncHandler = (fn) =>{
   return async(req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch
      ((Error) => next(Error));
    };
};


// const asynchandler = (fn) =>
//   async (req, res, next) => {
//     try {await fn(req, res, next);
//     }
//     catch (error) {res.status(error.status || 500).json({message: error.message || "Internal Server Error" });
//     }};





export {asyncHandler};

// module.exports = asynchandler;
