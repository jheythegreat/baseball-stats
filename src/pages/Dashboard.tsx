"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Heading,
  Text,
  Select,
  Button,
  useToast,
  Flex,
  Spacer,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Stack,
  ButtonGroup,
  Image,
  Center,
} from "@chakra-ui/react"
import { jsPDF } from "jspdf"
import { CSVLink } from "react-csv"

interface Player {
  id: string
  name: string
  position: string
  team: string
  stats: {
    date: string
    AB: number
    H: number
    doubles: number
    triples: number
    HR: number
    RBI: number
    R: number
    BB: number
    K: number
    SB: number
    IP: number
    ER: number
    W: number
    L: number
    SV: number
    HBP: number
    WP: number
    BK: number
  }
}

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation()
  const language = i18n.language
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"batting" | "pitching">("batting")
  const toast = useToast()

  useEffect(() => {
    // Mock data for players
    const mockPlayers: Player[] = [
      {
        id: "1",
        name: "Juan Soto",
        position: "OF",
        team: "NYY",
        stats: {
          date: "2024-01-01",
          AB: 500,
          H: 150,
          doubles: 30,
          triples: 5,
          HR: 30,
          RBI: 90,
          R: 80,
          BB: 70,
          K: 100,
          SB: 10,
          IP: 0,
          ER: 0,
          W: 0,
          L: 0,
          SV: 0,
          HBP: 0,
          WP: 0,
          BK: 0,
        },
      },
      {
        id: "2",
        name: "Gerrit Cole",
        position: "P",
        team: "NYY",
        stats: {
          date: "2024-01-01",
          AB: 0,
          H: 0,
          doubles: 0,
          triples: 0,
          HR: 0,
          RBI: 0,
          R: 0,
          BB: 0,
          K: 0,
          SB: 0,
          IP: 200,
          ER: 50,
          W: 15,
          L: 5,
          SV: 0,
          HBP: 5,
          WP: 10,
          BK: 1,
        },
      },
      {
        id: "3",
        name: "Shohei Ohtani",
        position: "DH/P",
        team: "LAD",
        stats: {
          date: "2024-01-01",
          AB: 500,
          H: 160,
          doubles: 35,
          triples: 7,
          HR: 40,
          RBI: 100,
          R: 90,
          BB: 80,
          K: 90,
          SB: 15,
          IP: 150,
          ER: 40,
          W: 12,
          L: 4,
          SV: 0,
          HBP: 3,
          WP: 8,
          BK: 0,
        },
      },
    ]
    setPlayers(mockPlayers)
    setSelectedPlayerId(mockPlayers[0]?.id || null)
  }, [])

  const player = players.find((p) => p.id === selectedPlayerId)

  const aggregateStats = players.reduce(
    (acc, p) => {
      if (p.id === selectedPlayerId) {
        return {
          AB: acc.AB + p.stats.AB,
          H: acc.H + p.stats.H,
          doubles: acc.doubles + p.stats.doubles,
          triples: acc.triples + p.stats.triples,
          HR: acc.HR + p.stats.HR,
          RBI: acc.RBI + p.stats.RBI,
          R: acc.R + p.stats.R,
          BB: acc.BB + p.stats.BB,
          K: acc.K + p.stats.K,
          SB: acc.SB + p.stats.SB,
        }
      }
      return acc
    },
    { AB: 0, H: 0, doubles: 0, triples: 0, HR: 0, RBI: 0, R: 0, BB: 0, K: 0, SB: 0 },
  )

  const aggregatePitchingStats = players.reduce(
    (acc, p) => {
      if (p.id === selectedPlayerId) {
        return {
          IP: acc.IP + p.stats.IP,
          H: acc.H + p.stats.H,
          R: acc.R + p.stats.R,
          ER: acc.ER + p.stats.ER,
          BB: acc.BB + p.stats.BB,
          K: acc.K + p.stats.K,
          HBP: acc.HBP + p.stats.HBP,
          WP: acc.WP + p.stats.WP,
          BK: acc.BK + p.stats.BK,
          W: acc.W + p.stats.W,
          L: acc.L + p.stats.L,
          SV: acc.SV + p.stats.SV,
        }
      }
      return acc
    },
    { IP: 0, H: 0, R: 0, ER: 0, BB: 0, K: 0, HBP: 0, WP: 0, BK: 0, W: 0, L: 0, SV: 0 },
  )

  // Function to calculate batting average
  const calcAVG = (stats: any) => {
    if (!stats || stats.AB === 0) return "0.000"
    return (stats.H / stats.AB).toFixed(3)
  }

  // Function to calculate on-base percentage
  const calcOBP = (stats: any) => {
    if (!stats || stats.AB + stats.BB === 0) return "0.000"
    return ((stats.H + stats.BB) / (stats.AB + stats.BB)).toFixed(3)
  }

  // Function to calculate slugging percentage
  const calcSLG = (stats: any) => {
    if (!stats || stats.AB === 0) return "0.000"
    return (
      (stats.H - stats.doubles - stats.triples - stats.HR + 2 * stats.doubles + 3 * stats.triples + 4 * stats.HR) /
      stats.AB
    ).toFixed(3)
  }

  // Function to calculate OPS
  const calcOPS = (stats: any) => {
    return (Number.parseFloat(calcOBP(stats)) + Number.parseFloat(calcSLG(stats))).toFixed(3)
  }

  // Function to calculate ERA
  const calcERA = (stats: any) => {
    if (!stats || stats.IP === 0) return "0.00"
    return ((stats.ER / stats.IP) * 9).toFixed(2)
  }

  // Function to calculate WHIP
  const calcWHIP = (stats: any) => {
    if (!stats || stats.IP === 0) return "0.00"
    return ((stats.BB + stats.H) / stats.IP).toFixed(2)
  }

  // Function to calculate K/BB ratio
  const calcKBB = (stats: any) => {
    if (!stats || stats.BB === 0) return "0.00"
    return (stats.K / stats.BB).toFixed(2)
  }

  // Function to calculate BAA (Batting Average Against)
  const calcBAA = (stats: any) => {
    if (!stats || stats.AB === 0) return "0.000"
    return (stats.H / stats.AB).toFixed(3)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Improved PDF template with centered title and line design
    // Header with lines
    doc.setLineWidth(0.5)
    doc.line(20, 15, pageWidth - 20, 15) // Top line

    // Title - Fix encoding and centering
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")

    // Use proper text encoding for Spanish characters
    const title = language === "es" ? "Estadisticas de Beisbol" : "Baseball Statistics"
    const titleWidth = doc.getTextWidth(title)
    const titleX = (pageWidth - titleWidth) / 2

    doc.text(title, titleX, 25)

    doc.setLineWidth(0.5)
    doc.line(20, 30, pageWidth - 20, 30) // Bottom line of title

    // Rest of the PDF generation code remains the same...
    // Player information section
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text(`${t.playerInfo}:`, 20, 45)

    doc.setLineWidth(0.2)
    doc.line(20, 48, 100, 48) // Underline section title

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")

    // Player data with field labels
    const playerInfo = [
      `${t.name}: ${player.name || "-"}`,
      `${t.position}: ${player.position || "-"}`,
      `${t.team}: ${player.team || "-"}`,
      `${t.date}: ${player.stats.date ? format(new Date(player.stats.date), "PP", { locale: language === "es" ? es : undefined }) : "-"}`,
    ]

    let y = 55
    playerInfo.forEach((info) => {
      doc.text(info, 25, y)
      y += 7
    })

    if (activeTab === "batting") {
      // Basic stats section
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(`${t.stats}:`, 20, 85)

      doc.setLineWidth(0.2)
      doc.line(20, 88, 100, 88) // Underline section title

      // Stats in two columns with borders
      const basicStats = [
        [`AB: ${aggregateStats.AB || 0}`, `H: ${aggregateStats.H || 0}`],
        [`2B: ${aggregateStats.doubles || 0}`, `3B: ${aggregateStats.triples || 0}`],
        [`HR: ${aggregateStats.HR || 0}`, `RBI: ${aggregateStats.RBI || 0}`],
        [`R: ${aggregateStats.R || 0}`, `BB: ${aggregateStats.BB || 0}`],
        [`K: ${aggregateStats.K || 0}`, `SB: ${aggregateStats.SB || 0}`],
      ]

      // Draw stats in a table-like format
      y = 95
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")

      // Create a light gray background for the stats table
      doc.setFillColor(245, 245, 245)
      doc.rect(25, y - 5, 160, 50, "F")

      // Draw table borders
      doc.setDrawColor(180, 180, 180)
      doc.setLineWidth(0.1)
      doc.rect(25, y - 5, 160, 50)

      // Draw horizontal lines
      for (let i = 1; i < 5; i++) {
        doc.line(25, y - 5 + i * 10, 185, y - 5 + i * 10)
      }

      // Draw vertical line in middle
      doc.line(105, y - 5, 105, y + 45)

      // Add stats text
      basicStats.forEach((row, index) => {
        doc.text(row[0], 30, y + index * 10)
        doc.text(row[1], 110, y + index * 10)
      })

      // Advanced stats section
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(`${t.advancedStats}:`, 20, 155)

      doc.setLineWidth(0.2)
      doc.line(20, 158, 120, 158) // Underline section title

      // Create another table for advanced stats
      const advancedStats = [
        [`${t.avg.title}: ${calcAVG(aggregateStats)}`, `${t.obp.title}: ${calcOBP(aggregateStats)}`],
        [`${t.slg.title}: ${calcSLG(aggregateStats)}`, `${t.ops.title}: ${calcOPS(aggregateStats)}`],
      ]

      // Draw advanced stats in a table-like format
      y = 165
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")

      // Create a light blue background for the advanced stats
      doc.setFillColor(235, 245, 255)
      doc.rect(25, y - 5, 160, 25, "F")

      // Draw table borders
      doc.setDrawColor(180, 180, 180)
      doc.setLineWidth(0.1)
      doc.rect(25, y - 5, 160, 25)

      // Draw horizontal line
      doc.line(25, y + 5, 185, y + 5)

      // Draw vertical line in middle
      doc.line(105, y - 5, 105, y + 20)

      // Add advanced stats text
      advancedStats.forEach((row, index) => {
        doc.text(row[0], 30, y + index * 10)
        doc.text(row[1], 110, y + index * 10)
      })
    } else {
      // Pitching stats section
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(`${t.pitchingStats}:`, 20, 85)

      doc.setLineWidth(0.2)
      doc.line(20, 88, 120, 88) // Underline section title

      // Stats in two columns with borders
      const pitchingBasicStats = [
        [`IP: ${aggregatePitchingStats.IP || 0}`, `H: ${aggregatePitchingStats.H || 0}`],
        [`R: ${aggregatePitchingStats.R || 0}`, `ER: ${aggregatePitchingStats.ER || 0}`],
        [`BB: ${aggregatePitchingStats.BB || 0}`, `K: ${aggregatePitchingStats.K || 0}`],
        [`HBP: ${aggregatePitchingStats.HBP || 0}`, `WP: ${aggregatePitchingStats.WP || 0}`],
        [
          `BK: ${aggregatePitchingStats.BK || 0}`,
          `W: ${aggregatePitchingStats.W || 0}-${aggregatePitchingStats.L || 0}, SV: ${aggregatePitchingStats.SV || 0}`,
        ],
      ]

      // Draw stats in a table-like format
      y = 95
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")

      // Create a light gray background for the stats table
      doc.setFillColor(245, 245, 245)
      doc.rect(25, y - 5, 160, 50, "F")

      // Draw table borders
      doc.setDrawColor(180, 180, 180)
      doc.setLineWidth(0.1)
      doc.rect(25, y - 5, 160, 50)

      // Draw horizontal lines
      for (let i = 1; i < 5; i++) {
        doc.line(25, y - 5 + i * 10, 185, y - 5 + i * 10)
      }

      // Draw vertical line in middle
      doc.line(105, y - 5, 105, y + 45)

      // Add stats text
      pitchingBasicStats.forEach((row, index) => {
        doc.text(row[0], 30, y + index * 10)
        doc.text(row[1], 110, y + index * 10)
      })

      // Advanced stats section
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(`${t.advancedStats}:`, 20, 155)

      doc.setLineWidth(0.2)
      doc.line(20, 158, 120, 158) // Underline section title

      // Create another table for advanced stats
      const advancedPitchingStats = [
        [`${t.era.title}: ${calcERA(aggregatePitchingStats)}`, `${t.whip.title}: ${calcWHIP(aggregatePitchingStats)}`],
        [`${t.kbb.title}: ${calcKBB(aggregatePitchingStats)}`, `${t.baa.title}: ${calcBAA(aggregatePitchingStats)}`],
      ]

      // Draw advanced stats in a table-like format
      y = 165
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")

      // Create a light blue background for the advanced stats
      doc.setFillColor(235, 245, 255)
      doc.rect(25, y - 5, 160, 25, "F")

      // Draw table borders
      doc.setDrawColor(180, 180, 180)
      doc.setLineWidth(0.1)
      doc.rect(25, y - 5, 160, 25)

      // Draw horizontal line
      doc.line(25, y + 5, 185, y + 5)

      // Draw vertical line in middle
      doc.line(105, y - 5, 105, y + 20)

      // Add advanced stats text
      advancedPitchingStats.forEach((row, index) => {
        doc.text(row[0], 30, y + index * 10)
        doc.text(row[1], 110, y + index * 10)
      })
    }

    // Add timestamp at the bottom
    const today = new Date()
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(
      `${today.toLocaleDateString(language === "es" ? "es-ES" : "en-US")} - ${player.name || "Player"} Stats Report`,
      pageWidth / 2,
      280,
      { align: "center" },
    )

    // Save PDF
    doc.save(`${player.name || "player"}_stats.pdf`)

    toast({
      title: t.exportSuccess,
      description: `${player.name || "player"}_stats.pdf`,
    })
  }

  const csvData = React.useMemo(() => {
    if (!player) return []

    const baseData = {
      Name: player.name,
      Position: player.position,
      Team: player.team,
      Date: player.stats.date
        ? format(new Date(player.stats.date), "PP", { locale: language === "es" ? es : undefined })
        : "-",
    }

    if (activeTab === "batting") {
      return [
        {
          ...baseData,
          "At Bats (AB)": aggregateStats.AB || 0,
          "Hits (H)": aggregateStats.H || 0,
          "Doubles (2B)": aggregateStats.doubles || 0,
          "Triples (3B)": aggregateStats.triples || 0,
          "Home Runs (HR)": aggregateStats.HR || 0,
          "Runs Batted In (RBI)": aggregateStats.RBI || 0,
          "Runs (R)": aggregateStats.R || 0,
          "Walks (BB)": aggregateStats.BB || 0,
          "Strikeouts (K)": aggregateStats.K || 0,
          "Stolen Bases (SB)": aggregateStats.SB || 0,
          "Batting Average (AVG)": calcAVG(aggregateStats),
          "On-Base Percentage (OBP)": calcOBP(aggregateStats),
          "Slugging Percentage (SLG)": calcSLG(aggregateStats),
          OPS: calcOPS(aggregateStats),
        },
      ]
    } else {
      return [
        {
          ...baseData,
          "Innings Pitched (IP)": aggregatePitchingStats.IP || 0,
          "Hits Allowed (H)": aggregatePitchingStats.H || 0,
          "Runs Allowed (R)": aggregatePitchingStats.R || 0,
          "Earned Runs (ER)": aggregatePitchingStats.ER || 0,
          "Walks (BB)": aggregatePitchingStats.BB || 0,
          "Strikeouts (K)": aggregatePitchingStats.K || 0,
          "Hit By Pitch (HBP)": aggregatePitchingStats.HBP || 0,
          "Wild Pitches (WP)": aggregatePitchingStats.WP || 0,
          "Balks (BK)": aggregatePitchingStats.BK || 0,
          "Wins (W)": aggregatePitchingStats.W || 0,
          "Losses (L)": aggregatePitchingStats.L || 0,
          "Saves (SV)": aggregatePitchingStats.SV || 0,
          "Earned Run Average (ERA)": calcERA(aggregatePitchingStats),
          "Walks and Hits Per Inning Pitched (WHIP)": calcWHIP(aggregatePitchingStats),
          "Strikeout-to-Walk Ratio (K/BB)": calcKBB(aggregatePitchingStats),
          "Batting Average Against (BAA)": calcBAA(aggregatePitchingStats),
        },
      ]
    }
  }, [
    player,
    aggregateStats,
    aggregatePitchingStats,
    activeTab,
    language,
    calcAVG,
    calcOBP,
    calcSLG,
    calcOPS,
    calcERA,
    calcWHIP,
    calcKBB,
    calcBAA,
    format,
    es,
  ])

  const csvFilename = `${player?.name || "player"}_stats.csv`

  return (
    <Box p={5}>
      <Flex align="center" mb={4}>
        <Heading as="h1" size="xl">
          {t.dashboardTitle}
        </Heading>
        <Spacer />
        <Select value={selectedPlayerId || ""} onChange={(e) => setSelectedPlayerId(e.target.value)} width="300px">
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name} ({player.team} - {player.position})
            </option>
          ))}
        </Select>
      </Flex>
      <Divider mb={4} />

      {player ? (
        <Box>
          <Flex mb={4}>
            <Box width="40%">
              <Image
                src={`https://via.placeholder.com/300x200`}
                alt={`${player.name}`}
                fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
                borderRadius="md"
                boxShadow="md"
              />
              <Stack mt={3}>
                <Text fontSize="lg" fontWeight="bold">
                  {player.name}
                </Text>
                <Text>Position: {player.position}</Text>
                <Text>Team: {player.team}</Text>
              </Stack>
            </Box>
            <Box width="60%" pl={5}>
              <Tabs
                variant="soft-rounded"
                colorScheme="green"
                onChange={(index) => setActiveTab(index === 0 ? "batting" : "pitching")}
              >
                <TabList>
                  <Tab>{t.battingStats}</Tab>
                  <Tab>{t.pitchingStats}</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <StatGroup>
                      <Stat>
                        <StatLabel>{t.ab.title}</StatLabel>
                        <StatNumber>{aggregateStats.AB || 0}</StatNumber>
                        <StatHelpText>{t.ab.description}</StatHelpText>
                      </Stat>

                      <Stat>
                        <StatLabel>{t.h.title}</StatLabel>
                        <StatNumber>{aggregateStats.H || 0}</StatNumber>
                        <StatHelpText>{t.h.description}</StatHelpText>
                      </Stat>

                      <Stat>
                        <StatLabel>{t.hr.title}</StatLabel>
                        <StatNumber>{aggregateStats.HR || 0}</StatNumber>
                        <StatHelpText>{t.hr.description}</StatHelpText>
                      </Stat>
                    </StatGroup>
                  </TabPanel>
                  <TabPanel>
                    <StatGroup>
                      <Stat>
                        <StatLabel>{t.ip.title}</StatLabel>
                        <StatNumber>{aggregatePitchingStats.IP || 0}</StatNumber>
                        <StatHelpText>{t.ip.description}</StatHelpText>
                      </Stat>

                      <Stat>
                        <StatLabel>{t.er.title}</StatLabel>
                        <StatNumber>{aggregatePitchingStats.ER || 0}</StatNumber>
                        <StatHelpText>{t.er.description}</StatHelpText>
                      </Stat>

                      <Stat>
                        <StatLabel>{t.k.title}</StatLabel>
                        <StatNumber>{aggregatePitchingStats.K || 0}</StatNumber>
                        <StatHelpText>{t.k.description}</StatHelpText>
                      </Stat>
                    </StatGroup>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Flex>

          <Flex justify="flex-end" mt={4}>
            <ButtonGroup spacing="4">
              <Button colorScheme="blue" onClick={exportToPDF}>
                {t.exportPDF}
              </Button>
              <CSVLink data={csvData} filename={csvFilename}>
                <Button colorScheme="blue">{t.exportCSV}</Button>
              </CSVLink>
            </ButtonGroup>
          </Flex>
        </Box>
      ) : (
        <Center>
          <Text fontSize="xl">{t.noPlayerSelected}</Text>
        </Center>
      )}
    </Box>
  )
}

export default Dashboard
