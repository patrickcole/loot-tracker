const APIResponse = (res, err, data, notFoundMessage, successMessage = '') => {

  if ( err ) return res.json({ success: false, message: err });
  if ( !data ) return res.json( { success: true, message: notFoundMessage });
  return res.json({ success: true, message: successMessage, data: data });
};

module.exports = APIResponse;