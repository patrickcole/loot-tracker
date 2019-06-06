const APIResponse = (res, err, data, notFoundMessage) => {

  if ( err ) return res.json({ success: false, error: err });
  if ( !data ) return res.json( { success: true, data: { message: notFoundMessage } } );
  return res.json({ success: true, data: data });
};

module.exports = APIResponse;