const HTTP_HEADER_JSON = {'Accept': 'application/json', 'Content-Type': 'application/json'};

export const asyncFetch = async function(url, json) {

  if ( json ) {
    json = {...json, headers: HTTP_HEADER_JSON }
  };
  
  let response = await fetch(url, json);
  let data = await response.json();
  return data;
}

export const getRouteName = function(path) {
  return path.match(/\/([^\/]+)\/?$/)[1];
}

const Network = () => {
  console.log("Network Utility");
}

export default Network;