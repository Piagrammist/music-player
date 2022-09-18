<script>
  export let music

  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  function formatSeconds(seconds) {
    const minutes = Math.floor(seconds / 60)
    seconds = Math.floor(seconds % 60)
    const minutesString =
      minutes < 10 ? '0' + minutes.toString() : minutes.toString()
    const secondsString =
      seconds < 10 ? '0' + seconds.toString() : seconds.toString()
    return `${minutesString}:${secondsString}`
  }
  function setRangeProgressWidth(e, width=-1) {
    const padding = 0.8
    if (width === -1) {
      width = Math.floor(e.value / (e.max - e.min) * 100 - padding)
      if (e.value > 75) width -= padding
    }
    if (width < 0)   width = 0
    if (width > 100) width = 100
    e.style.setProperty('--width'  , width   + '%')
    e.style.setProperty('--padding', padding + '%')
  }

  let duration, now, ribbon
  music.addEventListener('loadedmetadata', () => {
    now.innerText      = formatSeconds(music.currentTime)
    duration.innerText = formatSeconds(music.duration)
    ribbon.max      = Math.floor(music.duration).toString()
    ribbon.disabled = false
  })
  music.addEventListener('timeupdate', () => {
    now.innerText = formatSeconds(music.currentTime)
    ribbon.value  = music.currentTime.toString()
    setRangeProgressWidth(ribbon)
  })
  music.addEventListener('ended', () => {
    ribbon.value  = '0'
    now.innerText = formatSeconds(0)
    dispatch('togglePlayIcon')
    setRangeProgressWidth(ribbon, 0)
  })

  function onChange() {
    music.currentTime = parseInt(this.value)
    if (music.paused) {
      music.play()
      dispatch('togglePlayIcon')
    }
  }
  function onInput() {
    if (!music.paused) {
      music.pause()
      dispatch('togglePlayIcon')
    }
    now.innerText = formatSeconds(parseInt(this.value))
    setRangeProgressWidth(this)
  }
</script>

<div style="width: 100%;">
  <div id=info>
    <div id=name>Safe</div>
    <div id=author>Dallic</div>
  </div>
  <div id=time>
    <span id=now bind:this={now}>00:00</span>
    <input type=range min=0 value=0 disabled
      bind:this={ribbon} on:change={onChange} on:input={onInput}>
    <span id=duration bind:this={duration}>00:00</span>
  </div>
</div>

<style lang=scss>
  @use '../mixin';

  #info {
    width:      inherit;
    margin:     0.8em 0;
    min-height: 2.4em;
    text-align: center;
  }
  #name {
    font-size:   1.2rem;
    font-weight: bold;
  }
  #author {
    font-size: 0.8rem;
  }
  #time {
    @include mixin.flex-center;
    width:  inherit;
    height: 20px;
  }
  #now, #duration {
    color:       #000;
    font-size:   0.8rem;
    font-weight: bold;
  }

  @mixin thumb {
    @include mixin.clear;
    width:            4px;
    transition:       width 100ms ease-in-out;
    aspect-ratio:     1 / 1;
    border-radius:    50%;
    background-color: #111;
  }
  input[type=range] {
    @include mixin.clear;
    width:    65%;
    height:   4px;
    margin:   0 0.75em;
    position: relative;
    border-radius:    2px;
    background-color: #111;

    &::-moz-range-thumb     { @include thumb; }
    &::-webkit-slider-thumb { @include thumb; }
  }
  input[type=range]:not(:disabled) {
    &::-webkit-slider-thumb       { cursor: pointer; }
    &:hover::-webkit-slider-thumb { width:  14px;    }
  }
  input[type=range] {
    &::before, &::after {
      left:       var(--padding, 0);
      width:      var(--width  , 0);
      height:     1px;
      content:    '';
      opacity:    0.5;
      position:   absolute;
      transition: transform 400ms, opacity 350ms;

      background-color: #000;
    }
    &::before { top:    -3px; }
    &::after  { bottom: -3px; }

    &:hover {
      &::before, &::after {
        opacity: 0.3;
      }
      &::before { transform: translateY( 1px); }
      &::after  { transform: translateY(-1px); }
    }
  }
</style>
