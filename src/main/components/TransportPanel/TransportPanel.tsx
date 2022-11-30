import styled from "@emotion/styled"
import {
  FastForward,
  FastRewind,
  FiberManualRecord,
  Loop,
  Stop,
} from "@mui/icons-material"
import { CircularProgress, Tooltip } from "@mui/material"
import MetronomeIcon from "mdi-react/MetronomeIcon"
import { observer } from "mobx-react-lite"
import { FC, useCallback } from "react"
import { localized } from "../../../common/localize/localizedString"
import { programChangeMidiEvent } from "../../../common/midi/MidiEvent"
import {
  createNoteMuMu,
  fastForwardOneNote,
  playOrPause,
  rewindOneNote,
  stop,
  toggleEnableLoop,
} from "../../actions"
import { saveFileAs } from "../../actions/file"
import { toggleRecording } from "../../actions/recording"
import { FretBoard } from "../../helpers/MuMuMusic/FretBoard"
import { modes } from "../../helpers/MuMuMusic/Modes"
import { PitchClass } from "../../helpers/MuMuMusic/PitchClass"
import AtomState, { AtomType } from "../../helpers/MuMuMusic/types/AtomState"
import Frame from "../../helpers/MuMuMusic/types/Frame"
import Grid from "../../helpers/MuMuMusic/types/Grid"
import MechState, {
  MechStatus,
  MechType,
} from "../../helpers/MuMuMusic/types/MechState"
import { useStores } from "../../hooks/useStores"
import { VolumeSlider } from "../PianoRollToolbar/VolumeSlider"
import { CircleButton } from "./CircleButton"
import { PlayButton } from "./PlayButton"
import { TempoForm } from "./TempoForm"

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 1rem;
  background: ${({ theme }) => theme.backgroundColor};
  border-top: 1px solid ${({ theme }) => theme.dividerColor};
  height: 3rem;
  box-sizing: border-box;
`

const RecordButton = styled(CircleButton)`
  &.active {
    color: ${({ theme }) => theme.recordColor};
  }
`

const LoopButton = styled(CircleButton)`
  &.active {
    color: ${({ theme }) => theme.themeColor};
  }
`

const MetronomeButton = styled(CircleButton)`
  &.active {
    color: ${({ theme }) => theme.themeColor};
  }
`

const TimestampText = styled.div`
  font-family: "Roboto Mono", monospace;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.secondaryTextColor};
`

const Timestamp: FC = observer(() => {
  const { pianoRollStore } = useStores()
  const mbtTime = pianoRollStore.currentMBTTime
  return <TimestampText>{mbtTime}</TimestampText>
})

export const ToolbarSeparator = styled.div`
  background: ${({ theme }) => theme.dividerColor};
  margin: 0.4em 1em;
  width: 1px;
  height: 1rem;
`

export const Right = styled.div`
  position: absolute;
  right: 1em;
`

export const TransportPanel: FC = observer(() => {
  const rootStore = useStores()
  const { player } = rootStore

  const { exportStore } = rootStore

  const track = rootStore.song.selectedTrack
  const { isPlaying, isMetronomeEnabled, loop } = player
  const isRecording = rootStore.midiRecorder.isRecording
  const canRecording =
    Object.values(rootStore.midiDeviceStore.enabledInputs).filter((e) => e)
      .length > 0
  const isSynthLoading = rootStore.synth.isLoading

  const { song, pianoRollStore } = useStores()

  const { selectedTrack, selectedTrackId } = song

  const onClickPlay = playOrPause(rootStore)
  const onClickStop = stop(rootStore)
  const onClickBackward = rewindOneNote(rootStore)
  const onClickForward = fastForwardOneNote(rootStore)
  const onClickRecord = toggleRecording(rootStore)
  const onClickEnableLoop = toggleEnableLoop(rootStore)
  const onClickMetronone = useCallback(() => {
    player.isMetronomeEnabled = !player.isMetronomeEnabled
  }, [player])

  if (track === undefined) {
    throw new Error("selectedTrack is undefined")
  }

  const channel = track.channel

  /*
BUILD TEST DATA SIMULATING DEMO 01
*/

  // Create Mech Trajectories - Each X,Y pair corresponds to Frame Data

  var simulation_steps = 100

  var mech1_grid_path = [
    [3, 3],
    [4, 3],
    [4, 4],
    [3, 4],
  ]
  var mech2_grid_path = [
    [5, 5],
    [5, 6],
    [5, 7],
    [6, 7],
    [7, 7],
    [7, 6],
    [7, 5],
    [6, 5],
  ]

  var mech_grid_paths = [mech1_grid_path, mech2_grid_path]

  var frames: Frame[] = []
  var atoms: AtomState[] = []
  var mech_states: MechState[] = []

  // delivered_accumulated array - Dummy Data for Now

  var atomt: AtomType[] = []
  atomt[0] = AtomType.VANILLA
  atomt[1] = AtomType.HAZELNUT

  // Create Grid & Mechs for Frame Data
  for (var i = 0; i < simulation_steps; i++) {
    for (var j = 0; j < mech_grid_paths.length; j++) {
      var idx = i % mech_grid_paths[j].length

      let gridvals: Grid = {
        x: mech_grid_paths[j][idx][0],
        y: mech_grid_paths[j][idx][1],
      }

      let mechstatevals: MechState = {
        id: "mech" + (j + 1),
        typ: MechType.SINGLETON,
        status: MechStatus.OPEN,
        index: gridvals,
        pc_next: i,
      }

      mech_states[j] = mechstatevals
    }

    // map for grid_populated_bools

    var bools: { [name: string]: boolean } = {}
    bools.test = true

    let frameval: Frame = {
      mechs: [...mech_states],
      atoms: atoms,
      grid_populated_bools: bools,
      delivered_accumulated: atomt,
      cost_accumulated: 0,
      notes: "",
    }

    frames[i] = frameval
  }

  /*
    CREATE MUMU NOTES -
    
    Loop through each frame, and access notes from the 'FretBoard'
  */

  const computeMuMuNotes = () => {
    // Make a Guqin with 8 strings (instead of the traditional 7), with 8 frets

    let tonic = new PitchClass(5, 0) // Traditionally tuned to F
    let tonic2 = new PitchClass(1, 0) // Tuned to C# cause it'll sound nice against the guqin

    var guqin = new FretBoard(
      "guqin_8_string",
      [0, 1, 1, 1, 1, 1, 1, 1],
      8,
      3,
      tonic,
      modes.pentatonic
    )

    /*
     Here, we define an 8 string guitar with pentatonic notes but with the same modal spacing as a regular guitar!!!

     Listen for the difference between each sound. Both the guitar and guqin have the same trajectory but different interval mapping so they sound similar 
     varied! Something to think about when formulas start changing the harmonies
     */
    var guitar = new FretBoard(
      "guitar_8_string",
      [0, 3, 3, 3, 2, 3, 2, 2],
      8,
      0,
      tonic2,
      modes.pentatonic
    )

    var frets = guqin.calculateFrets()
    var frets2 = guitar.calculateFrets()

    var offset = 36 // 3 octave offset for a musical range

    for (var i = 0; i < 100; i++) {
      for (var j = 0; j < frames[i].mechs.length; j++) {
        //Get Grid Dimensions for each mech
        // J = mech id

        //index into fretboard grid
        var x_idx = frames[i].mechs[j].index.x
        var y_idx = frames[i].mechs[j].index.y

        // example of chord changes via some formula:

        if (i % 32 < 16) {
          var fretvals = frets[x_idx][y_idx]
        } else {
          var fretvals = frets2[x_idx][y_idx]
        }

        const note = createNoteMuMu(rootStore)(
          (960 / 2) * i,
          fretvals + offset,
          80,
          960 / 2
        )

        console.log(frames[i].mechs[j].index, fretvals)
      }
    }
  }

  /*

  Function to Trigger Notes in Real-Time

  */

  const onCompute = () => {
    //change Instrument choice by 3 argument of programChangeMidiEvent
    player.sendEvent(programChangeMidiEvent(0, 0, 10))
    const noteNumber = 60
    player.startNote({
      noteNumber,
      velocity: 100,
      channel: 0,
    })
    player.stopNote(
      {
        noteNumber,
        channel: 0,
      },
      0.5
    )
    console.log("Play Notes")
  }

  const safeFileAttempt = () => {
    // handleClose()
    exportStore.openExportDialog = true
    console.log(exportStore)

    console.log("Save File")
  }

  const safeMidiAttempt = () => {
    // handleClose()
    close()
    saveFileAs(rootStore)

    console.log("Save Midi")
  }

  const newLocal = "stop2"
  return (
    <Toolbar>
      <VolumeSlider trackId={selectedTrackId} />

      <Tooltip
        title={`${localized("Compute MuMu Notes", "Compute MuMu Notes")}`}
        placement="top"
      >
        <CircleButton onClick={computeMuMuNotes}>
          <Stop />
        </CircleButton>
      </Tooltip>

      <Tooltip title={`${localized("Save MIDI", "Save MIDI")}`} placement="top">
        <CircleButton onClick={safeMidiAttempt}>
          <Stop />
        </CircleButton>
      </Tooltip>

      <Tooltip title={`${localized("Save File", "Save File")}`} placement="top">
        <CircleButton onClick={safeFileAttempt}>
          <Stop />
        </CircleButton>
      </Tooltip>

      <Tooltip title={`${localized("Play Note", "Play Note")}`} placement="top">
        <CircleButton onClick={onCompute}>
          <Stop />
        </CircleButton>
      </Tooltip>

      <Tooltip title={`${localized("stop", "Stop")}`} placement="top">
        <CircleButton onClick={onClickStop}>
          <Stop />
        </CircleButton>
      </Tooltip>

      <Tooltip title={`${localized("rewind", "Rewind")}`} placement="top">
        <CircleButton onClick={onClickBackward}>
          <FastRewind />
        </CircleButton>
      </Tooltip>

      <Tooltip
        title={`${localized("play-pause", "Play/Pause")} [space]`}
        placement="top"
      >
        <PlayButton onClick={onClickPlay} isPlaying={isPlaying} />
      </Tooltip>

      {canRecording && (
        <Tooltip title={`${localized("record", "Record")}`} placement="top">
          <RecordButton
            onClick={onClickRecord}
            className={isRecording ? "active" : undefined}
          >
            <FiberManualRecord />
          </RecordButton>
        </Tooltip>
      )}

      <Tooltip
        title={`${localized("fast-forward", "Fast Forward")}`}
        placement="top"
      >
        <CircleButton onClick={onClickForward}>
          <FastForward />
        </CircleButton>
      </Tooltip>

      {loop && (
        <LoopButton
          onClick={onClickEnableLoop}
          className={loop.enabled ? "active" : undefined}
        >
          <Loop />
        </LoopButton>
      )}

      <ToolbarSeparator />

      <MetronomeButton
        onClick={onClickMetronone}
        className={isMetronomeEnabled ? "active" : undefined}
      >
        <MetronomeIcon />
      </MetronomeButton>

      <TempoForm />

      <ToolbarSeparator />

      <Timestamp />

      {isSynthLoading && (
        <Right>
          <CircularProgress size="1rem" />
        </Right>
      )}
    </Toolbar>
  )
})

function handleClose() {
  throw new Error("Function not implemented.")
}
