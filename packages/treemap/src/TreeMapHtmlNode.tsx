import { memo } from 'react'
import { animated } from '@react-spring/web'
import { useTheme } from '@nivo/core'
import { NodeProps, TreeMapDatum } from './types'
import { htmlNodeTransform, htmlLabelTransform } from './transitions'

/*
parentLabelHtmlTransform: `translate(${
    node.parentLabelX - (node.parentLabelRotation === 0 ? 0 : 5)
}px,${node.parentLabelY - (node.parentLabelRotation === 0 ? 5 : 0)}px) rotate(${
    node.parentLabelRotation
}deg)`,
*/

const NonMemoizedTreeMapHtmlNode = <Datum extends TreeMapDatum>({
    node,
    animatedProps,
    borderWidth,
    enableLabel,
    enableParentLabel,
    labelSkipSize,
}: NodeProps<Datum>) => {
    const theme = useTheme()

    const showLabel =
        enableLabel &&
        node.isLeaf &&
        (labelSkipSize === 0 || Math.min(node.width, node.height) > labelSkipSize)

    const showParentLabel = enableParentLabel && node.isParent

    return (
        <animated.div
            id={node.path.replace(/[^\w]/gi, '-')}
            style={{
                boxSizing: 'border-box',
                position: 'absolute',
                top: 0,
                left: 0,
                transform: htmlNodeTransform(animatedProps.x, animatedProps.y),
                width: animatedProps.width,
                height: animatedProps.height,
                borderWidth,
                borderStyle: 'solid',
                borderColor: node.borderColor,
                overflow: 'hidden',
            }}
        >
            <animated.div
                style={{
                    boxSizing: 'border-box',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: node.opacity,
                    width: animatedProps.width,
                    height: animatedProps.height,
                    background: animatedProps.color,
                }}
                onMouseEnter={node.onMouseEnter}
                onMouseMove={node.onMouseMove}
                onMouseLeave={node.onMouseLeave}
                onClick={node.onClick}
            />
            {showLabel && (
                <animated.span
                    style={{
                        ...theme.labels.text,
                        position: 'absolute',
                        display: 'flex',
                        top: -5,
                        left: -5,
                        width: 10,
                        height: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                        color: node.labelTextColor,
                        transformOrigin: 'center center',
                        transform: htmlLabelTransform(
                            animatedProps.labelX,
                            animatedProps.labelY,
                            animatedProps.labelRotation
                        ),
                        opacity: animatedProps.labelOpacity,
                        pointerEvents: 'none',
                    }}
                >
                    {node.label}
                </animated.span>
            )}
            {showParentLabel && (
                <animated.span
                    style={{
                        ...theme.labels.text,
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                        width: 10,
                        height: 10,
                        color: node.parentLabelTextColor,
                        transformOrigin: 'top left',
                        transform: htmlLabelTransform(
                            animatedProps.parentLabelX,
                            animatedProps.parentLabelY,
                            animatedProps.parentLabelRotation
                        ),
                        opacity: animatedProps.parentLabelOpacity,
                        pointerEvents: 'none',
                    }}
                >
                    {node.parentLabel}
                </animated.span>
            )}
        </animated.div>
    )
}

export const TreeMapHtmlNode = memo(NonMemoizedTreeMapHtmlNode) as typeof NonMemoizedTreeMapHtmlNode