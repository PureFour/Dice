let nameSubmitFormInput, submitNameButton;

const NameSubmitForm = {
    show: () => {
        nameSubmitFormInput = createInput();
        nameSubmitFormInput.position(400, 150);

        submitNameButton = createButton('submit');
        submitNameButton.position(nameSubmitFormInput.x + nameSubmitFormInput.width, 150);
        submitNameButton.mousePressed(() => {
            if (!nameSubmitFormInput.value()) return;
            client.name = nameSubmitFormInput.value();
            submitNameButton.hide();
            nameSubmitFormInput.hide();
        });
    }
}