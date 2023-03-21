async function setupMediaSessionUntilSuccess() {
  let success = false;

  while (!success) {
    try {
      await playAudioAndBindMediaSession();
      success = true;
      setMessage("MediaSession has been setup");
    } catch (e) {
      console.error(e);
      await new Promise((res) => setTimeout(() => res(), 1000));
      setMessage("Interract with document to enable MediaSession");
    }
  }
}

async function playAudioAndBindMediaSession() {
  // In order to have MediaSession action handler working, we need a playing audio
  const audioTag = document.getElementById("audio");
  audioTag.loop = true;
  audioTag.volume = 0.001; // `muted` can prevent MediaSession to successfully attach, set a very low volume instead
  await audioTag.play();

  const namesOfAction = [
    ["play"],
    ["pause"],
    ["previoustrack"],
    ["nexttrack"],
    ["stop"],
    ["seekbackward"],
    ["seekforward"],
    ["seekto"],
    /* Video conferencing actions */
    ["togglemicrophone"],
    ["togglecamera"],
    ["hangup"],
    /* Presenting slides actions */
    ["previousslide"],
    ["nextslide"],
  ];

  for (const actionName of namesOfAction) {
    try {
      navigator.mediaSession.setActionHandler(actionName, () =>
        setMessage(actionName)
      );
    } catch (error) {
      console.log(
        `The media session action "${actionName}" is not supported yet.`
      );
    }
  }
}

function setMessage(message) {
  document.getElementById("message").innerText = message;
}

if (!"mediaSession" in navigator) {
  const errorMediaSessionUnavailable =
    "MediaSession unavailable for this browser";
  setMessage(errorMediaSessionUnavailable);
  throw new Error(errorMediaSessionUnavailable);
}

(() => setupMediaSessionUntilSuccess())();
