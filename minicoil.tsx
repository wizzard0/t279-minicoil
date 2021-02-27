import React from "react";
import { useEffect, useState } from "react";

export function useRecoilState<T>(atom: MinicoilAtom<T>): [T, setter<T>] {
    let [localState, setLocalState] = useState(atom.value)
    useEffect(() => {
        atom.listeners.add(setLocalState)
        return () => { atom.listeners.delete(setLocalState) }
    }, [setLocalState])
    return [localState, atom.globalSetter]
}

export function useRecoilValue<T>(atom: MinicoilAtom<T>) {
    return useRecoilState(atom)[0]
}

interface AtomConfig<T> {
    key: string
    default: T
}

type setter<T> = (x: T) => void;

export function atom<T>(a: AtomConfig<T>, verbose?: boolean): MinicoilAtom<T> {
    let { key, default: value } = a
    let ourAtom = getAtom(key, verbose)
    ourAtom.name = key
    if (typeof ourAtom.value === 'undefined') {
        verbose && console.log('setting default value', key, value)
        ourAtom.value = value
    }
    return ourAtom as any
}


interface MinicoilAtom<T> {
    name: string
    listeners: Set<setter<T>>
    value: T
    globalSetter: setter<T>
}

function getAtom(name: string, verbose: boolean): MinicoilAtom<{}> {
    if (!name) { throw new Error('atom name should be non-empty!') }
    let atoms = getWindowAtoms()
    return (atoms[name] = atoms[name] || newAtom(name, verbose))
}

function newAtom(name, verbose: boolean): MinicoilAtom<{}> {
    verbose && console.log('creating atom', name)
    return {
        listeners: new Set(), value: void 0, name,
        globalSetter: setAtomValue.bind(null, name)
    }
}

export function setAtomValue(name: string, value, verbose?: boolean) {
    let atom = getAtom(name, verbose);
    atom.value = value
    for (let x of atom.listeners) { x(value) }
}

// todo: move from global to context provider? how do we hot-reload then?
let fakeAtoms = {}

export function RecoilRoot({ children }) {
    return (<>{children}</>)
}

function getWindowAtoms(): { [key: string]: MinicoilAtom<{}> } {
    if ('undefined' === typeof window) { return fakeAtoms }
    //@ts-ignore
    return window.atoms = (window.atoms || {});
}

