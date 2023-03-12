

function Upload(){
  return(
      <form action="/upload_new" method="post">
        <label>
          <p>Item name</p>
        </label>
        <input type="text" name="item_name" id="item_name"/>
        <br/><br/>
        <label>
          <p>Description</p>
        </label>
        <input type="text" name="item_des" id="item_des"/>
        <br/><br/>
        <label>
          <p>Expiry date</p>
        </label>
        <input type="date" name="item_expiration_date" id="item_expiration_date"/>
        <br/><br/>
        <label>
          <p>Is is private</p>
        </label>
        <input type="number" name="is_private" id="is_private"/>
        <br/><br/>
        <label>
          <p>Provider</p>
        </label>
        <input type="text" name="item_provider" id="item_provider"/>
        <br/><br/>
        <label>
          <p>Location</p>
        </label>
        <input type="text" name="item_location" id="item_location"/>
        <br/><br/>
        <label>
          <p>Status</p>
        </label>
        <input type="text" name="item_status" id="item_status"/>
        <br/><br/>
        <input type="submit"/>
      </form>
  );
}

export default Upload;