// ---- Define your dialogs  and panels here ----
let panel = define_new_effective_permissions("panel_id", add_info_col = true)
let user_sel = define_new_user_select_field("user_id", "Select User", on_user_change = function(selected_user)
{
    $('#panel_id').attr('filepath', '/C/presentation_documents/important_file.txt')
    $('#panel_id').attr('username', selected_user)
})

$('#sidepanel').append(user_sel)
$('#sidepanel').append(panel)

// Question: What is the code necessary to build and display the effective permissions panel?
     // Need the function, this is what builds the panel, and append is what displays it
// Question: Which permissions does the administrator have for /C?
    // The administrator has all/full permissions for /C
// Question: What does the html look like for your effective permissions panel now?
    // Some permissions are now checked off (the permissions have changed)
// Question: What is your js code to create and add the user selection button/dialog?
    // See above (but without the jquery additions)
// Question: What does the completed line to create the user select field look like?
    // See above, but with jquery

let dialog = define_new_dialog("dialog_id", title='Permission Info')
$('.perm_info').click(function(){
    // 1
    $('#dialog_id').dialog('open')
    // 2
    // console.log($('#panel_id').attr('filepath'))
    // console.log($('#panel_id').attr('username'))
    // console.log($(this).attr('permission_name'))

    file_obj = path_to_file[$('#panel_id').attr('filepath')]
    user_obj = all_users[$('#panel_id').attr('username')]
    perm_name = $(this).attr('permission_name')

    let explanation_obj = allow_user_action(file_obj, user_obj, perm_name, explain_why = true)
    let explanation_text = get_explanation_text(explanation_obj)
    $('#dialog_id').text(explanation_text)
})

// Question: What does your initial click listener look like?
    // See above 1
// Question: What does your full console log method look like (please include its class selector)?
    // See above 2
// Question: What does your final click handler look like?
    // See above (current)

// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 