let nameSubmitFormInput, submitNameButton;
let nameConflictWarning = false;
const NameSubmitForm = {
    show: () => {
        nameSubmitFormInput = createInput();
        nameSubmitFormInput.position(400, 150);

        submitNameButton = createButton('submit');
        submitNameButton.position(nameSubmitFormInput.x + nameSubmitFormInput.width, 150);
        setTimeout(() => client.fetchOtherClientsNames(), 1000);
        submitNameButton.mousePressed(() => {
            if (!isValidName(nameSubmitFormInput.value())) {
                nameConflictWarning = true;
                return;
            }
            nameConflictWarning = false;
            client.name = nameSubmitFormInput.value();
            submitNameButton.hide();
            nameSubmitFormInput.hide();
        });
    }
}

const isValidName = (name) => {
    if (name) {
        return client.players
            .filter(p => p.name === name).length > 0 ? false : true;
    }
    return false;
}